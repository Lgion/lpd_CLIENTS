const IntroVideo = () => {
    return (
        <div className="intro-video-container">
            <iframe
                // src="https://www.youtube.com/embed/FjO441MnCr8"
                src="https://www.youtube.com/embed/cSL0O2KJcWc?si=Hjq0LHhx5ZH9Ia9W"
                title="Présentation Librairie Puissance Divine"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="intro-video"
                style={{width: "100%","height": "400px"}}
            />
        </div>
    );
};

export default IntroVideo;
