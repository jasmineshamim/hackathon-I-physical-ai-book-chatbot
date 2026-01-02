from rag_service import RAGService

def test_rag_service():
    """Test the RAG service to ensure it can retrieve documentation"""
    try:
        rag_service = RAGService()
        query = 'What is physical AI?'
        print(f'Testing RAG query: {query}')
        
        result = rag_service.query(query)
        print('RAG query successful!')
        print(f'Response preview: {result["response"][:200]}...')
        print(f'Number of sources: {len(result["sources"])}')
        
        if result["sources"]:
            print("\nSample source:")
            source = result["sources"][0]
            print(f"URL: {source['url']}")
            print(f"Score: {source['score']:.3f}")
            print(f"Content preview: {source['content'][:100]}...")
        
    except Exception as e:
        print(f'Error during RAG query: {e}')
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_rag_service()