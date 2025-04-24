import httpx
from bs4 import BeautifulSoup
from fastapi import APIRouter, Depends, HTTPException
from app.dependencies import get_current_user
from pydantic import BaseModel

router = APIRouter()

class BlogRequest(BaseModel):
    url: str

@router.post("/scrape")
async def scrape_and_summarize(req: BlogRequest, user: str = Depends(get_current_user)):
    try:
        # Fetch and parse the blog content
        response = httpx.get(req.url, timeout=15)
        soup = BeautifulSoup(response.text, "html.parser")

        # Extract and trim paragraph content
        article_text = " ".join(p.get_text() for p in soup.find_all("p"))[:3000]
        if not article_text.strip():
            raise HTTPException(status_code=422, detail="No meaningful content found in blog.")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to scrape blog: {str(e)}")

    try:
        # Call Ollama to summarize
        async with httpx.AsyncClient(timeout=60) as client:
            res = await client.post(
                "http://localhost:11434/api/generate",
                json={
                    "model": "llama3.2",
                    "prompt": f"Summarize this blog post:\n\n{article_text}",
                    "stream": False
                }
            )
            data = res.json()
            return {
                "summary": data.get("response", "No response from LLaMA"),
                "source": req.url
            }
    except httpx.RequestError as e:
        raise HTTPException(status_code=504, detail=f"LLaMA request failed: {str(e)}")
