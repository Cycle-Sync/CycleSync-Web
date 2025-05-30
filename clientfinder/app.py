import streamlit as st
from clientfinder.search_utils import *

st.set_page_config(page_title="Discussion Finder", layout="wide")

# UI Elements
st.title("🔍 AI-Powered Discussion Finder")
query = st.text_input("Describe your target customers or problem:", 
                     placeholder="e.g. 'Find e-commerce brands needing sustainable packaging'")

if query:
    with st.spinner('Searching across platforms...'):
        # Process query
        processed = process_query(query)
        
        # Gather results
        results = []
        results += search_reddit(processed)
        results += search_web(processed)
        
        # Rank results
        ranked = rank_results(results, processed['embedding'])
    
    # Display results
    # Modify the display section:
    for idx, item in enumerate(ranked[:20]):
        # Different icon for comments
        icon = "💬" if "Comment" in item['source'] else "📄"
        
        st.subheader(f"{icon} {idx+1}. {item['title']}")
        
        # Color-coded source
        source_color = (
            "#FF4500" if "Reddit" in item['source'] else 
            "#1DA1F2" if "Twitter" in item['source'] else 
            "#008000"
        )
        st.markdown(f"<span style='color:{source_color}; font-weight:bold'>"
                    f"{item['source']}</span> | "
                    f"Score: {item['relevance']:.2f} | "
                    f"[Link]({item['url']})", 
                    unsafe_allow_html=True)
        
        # Collapsible content preview
        with st.expander("Preview content"):
            st.write(item['content'][:500] + "...")
        
        st.markdown("---")