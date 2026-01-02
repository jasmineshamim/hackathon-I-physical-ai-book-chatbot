from typing import List, Dict, Any, Optional
from src.config.llm_client import get_cohere_client
from src.config.settings import settings


def generate_response(query: str, context_chunks: List[Dict[str, Any]], selected_text: Optional[str] = None) -> Dict[str, Any]:
    """
    Generate a response based on the query and provided context chunks
    """
    client = get_cohere_client()
    
    # Construct the context from the retrieved chunks
    context_parts = []
    for chunk in context_chunks:
        content = chunk.get("content", "")
        if content.strip():  # Only add non-empty content
            context_parts.append(content)
    
    # Combine all context parts
    context = "\n\n".join(context_parts)
    
    # If selected_text is provided, restrict the context to just that text
    if selected_text:
        context = selected_text
    
    # Check if context is empty
    if not context.strip():
        return {
            "answer": "This information is not available in the provided book content.",
            "confidence_score": 0.0,
            "sources": []
        }
    
    # Create the prompt for the model
    if selected_text:
        prompt = f"""
        Based only on the following selected text, answer the question:
        
        Selected Text: {selected_text}
        
        Question: {query}
        
        Answer: """
    else:
        prompt = f"""
        Based only on the following context, answer the question:
        
        Context: {context}
        
        Question: {query}
        
        Answer: """
    
    # Generate response using Cohere
    response = client.generate(
        model=settings.cohere_model,
        prompt=prompt,
        max_tokens=500,  # Adjust as needed
        temperature=0.1,  # Low temperature for more factual responses
        stop_sequences=["\n\n"]  # Stop at double newlines to avoid follow-up questions
    )
    
    # Extract the generated text
    answer = response.generations[0].text.strip()
    
    # If the model tries to answer despite insufficient context, override with standard message
    if "not available" in answer.lower() or "not mentioned" in answer.lower():
        answer = "This information is not available in the provided book content."
        confidence_score = 0.0
    else:
        # Calculate a basic confidence score based on the response
        # This is a simplified approach; in production, you might use more sophisticated methods
        confidence_score = min(0.95, len(answer) / (len(query) + len(context)) * 2)
        confidence_score = max(0.1, confidence_score)  # Ensure minimum confidence
    
    # Prepare the sources information
    sources = []
    for chunk in context_chunks:
        source_info = {
            "chunk_id": chunk.get("id"),
            "page_number": chunk.get("page_number"),
            "section_title": chunk.get("section_title")
        }
        # Only add source if it has meaningful information
        if any(source_info.values()):
            sources.append(source_info)
    
    return {
        "answer": answer,
        "confidence_score": confidence_score,
        "sources": sources
    }


def validate_response(response: str, context_chunks: List[Dict[str, Any]]) -> bool:
    """
    Validate that the response is grounded in the provided context
    This is a simplified validation - in production you might use more sophisticated fact-checking
    """
    # Convert response and context to lowercase for comparison
    response_lower = response.lower()
    
    # Check if the response contains information from the context
    for chunk in context_chunks:
        content = chunk.get("content", "").lower()
        # If there's significant overlap in content, consider it validated
        if len(content) > 10:  # Only check meaningful chunks
            # Check if any significant part of the chunk appears in the response
            words = content.split()
            if len(words) > 3:  # At least 3 words to check
                # Take the first few words as a sample
                sample = " ".join(words[:min(5, len(words))])
                if sample in response_lower:
                    return True
    
    # If no significant overlap found, it might be hallucinated
    return False