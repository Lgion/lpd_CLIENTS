


export default function NdrToggle() {
    return <div className="ndr_toggle">
        <button
            className="ndr_toggle_image_map_btn"
            onClick={e => {
                let section = e.target.closest('section')
                    , ndr_image = section.querySelector('.ndr_image')
                    , ndr_map = section.querySelector('.ndr_map')
                    , span = e.target.closest('.ndr_toggle_image_map_btn').querySelector('span')
                console.log(e.target.closest('.ndr_toggle_image_map_btn'));
                console.log(e.target.closest('.ndr_toggle_image_map_btn').querySelector('span'));
                ndr_image.classList.toggle('off')
                ndr_map.classList.toggle('off')
                if (ndr_image.classList.contains('off'))
                    span.innerText = "le plan routier"
                else span.innerText = "Google Map"
            }}
        >
            <div><b>Afficher</b> <span>Google Map</span></div>
        </button>
    </div>
}
