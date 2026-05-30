import streamlit as st
import os
import google.generativeai as genai
from PIL import Image
import json

# Page Configuration for elegant styling
st.set_page_config(
    page_title="EcoFriend - AI Plantation Companion",
    page_icon="🌱",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom Styling to match the "Sleek Interface" Theme palette
st.markdown("""
<style>
    /* Sleek Palette custom background and font rules */
    .stApp {
        background-color: #F0F4EF;
        color: #0F172A;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }
    div[data-testid="stSidebar"] {
        background-color: #FFFFFF;
        border-right: 1px solid #E2E8F0;
    }
    h1, h2, h3 {
        color: #064E3B !important;
        font-weight: 700;
    }
    .metric-card {
        background-color: #FFFFFF;
        padding: 20px;
        border-radius: 20px;
        border: 1px solid #E2E8F0;
        box-shadow: 0 2px 4px rgba(0,0,0,0.02);
        margin-bottom: 15px;
    }
    .custom-btn {
        background-color: #16A34A;
        color: white;
        border-radius: 12px;
        padding: 8px 16px;
        border: none;
    }
</style>
""", unsafe_allow_html=True)

# Application Logo & Title Sidebar
st.sidebar.markdown("<h1 style='text-align: center; font-size: 2rem;'>🌱 EcoFriend</h1>", unsafe_allow_html=True)
st.sidebar.markdown("<p style='text-align: center; color: #475569;'>Your Smart AI-Powered Plantation Companion</p>", unsafe_allow_html=True)
st.sidebar.markdown("---")

# Navigation Selector
menu = st.sidebar.radio(
    "Navigation Menu",
    ["🏠 Dashboard", "🔍 Disease Scan", "💧 Water Logic", "🤖 Chat with Prakriti", "🪴 Recommend Plants"]
)

# API Configurations
st.sidebar.markdown("---")
st.sidebar.subheader("Configuration")
api_key_input = st.sidebar.text_input("Enter Gemini API Key", type="password", help="Needed for AI analysis and chatbot functionality.")

# Prioritize sidebar user-input key, fallback to local/global environment
api_key = api_key_input if api_key_input else os.environ.get("GEMINI_API_KEY", "")

if api_key:
    genai.configure(api_key=api_key)
else:
    st.sidebar.info("💡 Note: Provide an API Key to activate AI modules.")

# Core Functionality Modules
if menu == "🏠 Dashboard":
    st.markdown("<h1>Welcome, Plant Parent!</h1>", unsafe_allow_html=True)
    st.markdown("<h3>Your botanical status summary for today</h3>", unsafe_allow_html=True)
    st.write("")

    col1, col2 = st.columns(2)
    with col1:
        st.markdown(f"""
        <div class="metric-card">
            <span style="font-size: 2rem;">🌿</span>
            <p style="color: #475569; font-size: 0.95rem; text-transform: uppercase; margin-bottom: 2px;">PrakritiMitra AI Status</p>
            <h2 style="margin: 0; color: #064E3B;">Your Aloe Vera is thriving!</h2>
            <p style="color: #16A34A; font-weight: 600; margin-top: 5px;">Next scheduled watering: In 2 days</p>
        </div>
        """, unsafe_allow_html=True)
    with col2:
        st.markdown("""
        <div class="metric-card">
            <span style="font-size: 2rem;">🏆</span>
            <p style="color: #475569; font-size: 0.95rem; text-transform: uppercase; margin-bottom: 2px;">Gardening Level Active</p>
            <h2 style="margin: 0; color: #16A34A;">350 XP Points</h2>
            <p style="color: #475569; margin-top: 5px;">Doing great! You are in the top 15% of urban gardeners.</p>
        </div>
        """, unsafe_allow_html=True)

    st.write("")
    st.markdown("### Featured Plant Recommendations")
    colA, colB = st.columns(2)
    with colA:
        st.markdown("""
        <div style="background-color: #FFFFFF; border-radius: 16px; padding: 16px; border: 1px solid #E2E8F0; display: flex; align-items: center; gap: 12px;">
            <div style="background-color: #DCFCE7; padding: 12px; border-radius: 12px; font-size: 24px;">🪴</div>
            <div style="flex-grow: 1;">
                <h4 style="margin:0; color: #0F172A;">Snake Plant</h4>
                <p style="margin:0; font-size: 11px; color: #475569;">98% Climate Compatibility</p>
            </div>
            <span style="background-color: #F0FDF4; color: #15803D; font-weight: bold; font-size: 11px; padding: 4px 10px; border-radius: 8px;">Easy</span>
        </div>
        """, unsafe_allow_html=True)
    with colB:
        st.markdown("""
        <div style="background-color: #FFFFFF; border-radius: 16px; padding: 16px; border: 1px solid #E2E8F0; display: flex; align-items: center; gap: 12px;">
            <div style="background-color: #FEF3C7; padding: 12px; border-radius: 12px; font-size: 24px;">🌵</div>
            <div style="flex-grow: 1;">
                <h4 style="margin:0; color: #0F172A;">Jade Succulent</h4>
                <p style="margin:0; font-size: 11px; color: #475569;">84% Climate Compatibility</p>
            </div>
            <span style="background-color: #EFF6FF; color: #1D4ED8; font-weight: bold; font-size: 11px; padding: 4px 10px; border-radius: 8px;">Medium</span>
        </div>
        """, unsafe_allow_html=True)

elif menu == "🔍 Disease Scan":
    st.markdown("<h1>Leaf Disease Diagnoser</h1>", unsafe_allow_html=True)
    st.markdown("<p style='color:#475569;'>Upload clear photos of leaves showing symptoms to get scientific identification and treatment instructions.</p>", unsafe_allow_html=True)
    
    file_upload = st.file_uploader("Upload leaf snapshot (PNG, JPG, JPEG)", type=["png", "jpg", "jpeg"])
    
    if file_upload:
        image = Image.open(file_upload)
        col1, col2 = st.columns([1, 1])
        with col1:
            st.image(image, caption="Uploaded Specimen", use_column_width=True)
        
        with col2:
            st.subheader("Diagnostic Engine Processing")
            if not api_key:
                st.warning("Please provide a valid Gemini API Key in the sidebar configurations to run diagnostic analysis.")
            else:
                if st.button("Diagnose Leaf Specimen"):
                    with st.spinner("Analyzing plant markers with Prakriti AI..."):
                        try:
                            # Prompt optimized for plant analysis
                            model = genai.GenerativeModel("gemini-2.5-flash")
                            prompt = """
                            Analyze this leaf image and tell me:
                            1. Plant Name
                            2. Health Status (Healthy or Diseased?)
                            3. Disease Name (if any)
                            4. Confidence Score (%)
                            5. Recommended Treatment / Healing plan
                            Please format the response clearly using clean botanical headers.
                            """
                            response = model.generate_content([prompt, image])
                            st.markdown("### Analysis Results")
                            st.write(response.text)
                        except Exception as e:
                            st.error(f"Error calling Gemini: {e}")

elif menu == "💧 Water Logic":
    st.markdown("<h1>Seasonal Smart Water Logic</h1>", unsafe_allow_html=True)
    st.markdown("<p style='color:#475569;'>Calculate complex custom hydration routines tailored to regional dynamics, seasonal weather variations, and soil absorption attributes.</p>", unsafe_allow_html=True)

    col1, col2 = st.columns(2)
    with col1:
        plant_type = st.selectbox("Select Plant Class", ["Succulent / Desert", "Leafy Greens", "Houseplant Foliage", "Fruit / Flowering Shrub"])
        soil_type = st.selectbox("Select Soil Mixture", ["Sandy (Fast Draining)", "Loam (Normal)", "Clay / Peat (Retains Hydration)"])
    with col1:
        season = st.selectbox("Current Season Type", ["Warm / Dry Summer", "Cool Rainy / Monsoon", "Humid / Tropical", "Winter / Dormant"])
        sunlight = st.slider("Daily Direct Sunlight Hours", 0, 12, 4)

    if st.button("Calculate Water Cycle"):
        # Local logic calculation matching Android module algorithm backports
        base_interval = 3 # days
        
        if "Succulent" in plant_type:
            base_interval += 7
        elif "Greens" in plant_type:
            base_interval -= 1

        if "Sandy" in soil_type:
            base_interval -= 1
        elif "Clay" in soil_type:
            base_interval += 2
            
        if "Rainy" in season:
            base_interval += 5
        elif "Summer" in season:
            base_interval -= 2

        if sunlight > 6:
            base_interval = max(1, base_interval - 1)

        st.success(f"🚰 Smart Schedule: Water this plant once every **{max(1, base_interval)}** days.")
        st.info("💡 Tip: Always feel the top 1 inch of soil. If it feels completely dry, irrigate immediately regardless of schedule calculation.")

elif menu == "🤖 Chat with Prakriti":
    st.markdown("<h1>Prakriti Botanical Assistant</h1>", unsafe_allow_html=True)
    st.markdown("<p style='color:#475569;'>Interactive trilingual advisory chatbot supporting botanical consulting in English, Tamil, and Hindi.</p>", unsafe_allow_html=True)

    # Initialize chat history
    if "messages" not in st.session_state:
        st.session_state.messages = []

    # Display chat messages from history on app rerun
    for msg in st.session_state.messages:
        with st.chat_message(msg["role"]):
            st.markdown(msg["content"])

    if user_query := st.chat_input("Ask Prakriti about plant care, pest management, or propagation..."):
        # Display user message
        with st.chat_message("user"):
            st.markdown(user_query)
        st.session_state.messages.append({"role": "user", "content": user_query})

        # Display assistant response
        with st.chat_message("assistant"):
            if not api_key:
                response_placeholder = "API Key not configured. Please enter a valid Gemini API Key in the side configurations to chat live!"
                st.warning(response_placeholder)
                st.session_state.messages.append({"role": "assistant", "content": response_placeholder})
            else:
                with st.spinner("Prakriti is formulating care solution..."):
                    try:
                        model = genai.GenerativeModel("gemini-2.5-flash")
                        prompt = f"System prompt: You are Prakriti, an expert friendly plant biologist, herbalist, and smart urban gardening companion. Respond helpfully to the following inquiry. Answer in the requested language (supports multilingual English/Tamil/Hindi inquiries seamlessly): {user_query}"
                        response = model.generate_content(prompt)
                        st.markdown(response.text)
                        st.session_state.messages.append({"role": "assistant", "content": response.text})
                    except Exception as e:
                        st.error(f"Error querying chatbot: {e}")

elif menu == "🪴 Recommend Plants":
    st.markdown("<h1>Personalized Bio-Compatibility Recommendations</h1>", unsafe_allow_html=True)
    st.markdown("<p style='color:#475569;'>Let Gemini recommend perfectly compatible houseplants matching your unique living spaces, maintenance experience level, and geographic zone.</p>", unsafe_allow_html=True)

    experience = st.select_slider("Select your gardening skills level", options=["Absolute Beginner", "Novice Developer", "Experienced Enthusiast", "Master Botanist"])
    placement = st.radio("Primary placement target location", ["Shaded Indoors / Bedroom", "Bright Living Room (Indirect Light)", "Balcony / Full Sun Outdoors", "High Humid Bathroom Environment"])
    pet_friendly = st.checkbox("Requires strictly pet-safe non-toxic plants")

    if st.button("Generate Plant Matches"):
        if not api_key:
            st.warning("Please configure your Gemini API Key in the sidebar to fetch real-time matching engine diagnostics!")
        else:
            with st.spinner("Sifting bio-database matches..."):
                try:
                    model = genai.GenerativeModel("gemini-2.5-flash")
                    prompt = f"""
                    Provide a top 3 home-gardening plant suggestion list based on:
                    - Maintenance Experience: {experience}
                    - Location/Sunlight Level: {placement}
                    - Non-Toxic to Pets requirement: {pet_friendly}
                    Format each recommendation cleanly with bullet points, brief care tips, and difficulty tags.
                    """
                    response = model.generate_content(prompt)
                    st.write(response.text)
                except Exception as e:
                    st.error(f"Error compiling compatibility engine: {e}")
