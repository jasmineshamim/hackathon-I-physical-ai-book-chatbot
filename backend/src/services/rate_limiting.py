import time
from collections import defaultdict, deque
from typing import Dict
from src.config.settings import settings


class RateLimiter:
    def __init__(self):
        # Dictionary to store request timestamps for each IP
        self.requests: Dict[str, deque] = defaultdict(deque)
        # Maximum requests allowed per time window
        self.max_requests = 100  # Can be adjusted based on settings
        # Time window in seconds
        self.time_window = 60  # 1 minute window

    def is_allowed(self, client_ip: str) -> bool:
        """
        Check if a request from the given IP is allowed based on rate limits
        """
        current_time = time.time()
        
        # Remove requests that are outside the time window
        while self.requests[client_ip] and \
              current_time - self.requests[client_ip][0] > self.time_window:
            self.requests[client_ip].popleft()
        
        # Check if the number of requests is within the limit
        if len(self.requests[client_ip]) < self.max_requests:
            # Add the current request timestamp
            self.requests[client_ip].append(current_time)
            return True
        
        # Rate limit exceeded
        return False


# Global rate limiter instance
rate_limiter = RateLimiter()


def check_rate_limit(client_ip: str) -> bool:
    """
    Public function to check if a request is allowed based on rate limits
    """
    return rate_limiter.is_allowed(client_ip)