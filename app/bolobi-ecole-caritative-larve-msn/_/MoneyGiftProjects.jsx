import {useState} from 'react'


export default function MoneyGiftProjects({ setItem, setProject, projects }) {

    // console.log(setItem)

    const [isSanctuaire, setIsSanctuaire] = useState(true)
    , ok = (e, item) => {
        console.log('okokok')

        e.target.closest('ul').querySelector('.active').classList.remove("active")
        e.target.closest('li').classList.add('active')

        if(item=="Sanctuaire")setIsSanctuaire(true)
        else setIsSanctuaire(false)
        
        setItem(item)
        setProject(null)


    }
    , okok = (e,subProject,item) => {
        e.stopPropagation()

        e.target.closest('section').querySelector('figure.active').classList.remove("active")
        e.target.closest('figure').classList.add('active')


        console.log(subProject)
        console.log(item.projects)
        
        
        setProject(subProject)
    }

    return <>
        <ul className={"money " + (isSanctuaire?"off":"")}>
            {projects.map((item, i) => <li
                key={"p_" + i}
                onClick={e => { ok(e, item) }}
                className={item == "Sanctuaire" ? "active" : ""}
            >
                <span>
                    {typeof item == 'string'
                        ? item
                        : item.name
                    }
                </span>
                    {typeof item != "string" &&
                        <section>
                            {item.projects?.map((subProject,i) => <figure onClick={e => {okok(e,subProject,item)}} className={""+(i==0?"active":"")}>
                                <img src={subProject.src} alt="" />
                                <figcaption>{subProject.title}</figcaption>
                            </figure>)}
                        </section>
                    }
            </li>)}
        </ul>
    </>
}