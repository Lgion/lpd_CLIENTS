const IntroVideo = () => {
    return (
        <div className="intro-video-container">
            <iframe
                src="https://www.youtube.com/embed/FjO441MnCr8"
                title="Présentation Librairie Puissance Divine"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="intro-video"
            />
        </div>
    );
};

export default IntroVideo;
