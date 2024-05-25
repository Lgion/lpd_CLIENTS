import styled,{createGlobalStyle} from 'styled-components'







export default function ShowProject({item,subProject,statsIcons}) {

    console.log(item)
    console.log(subProject)
    
    const DivStyled = styled.div`
        background: red;
        height:3em;
        overflow:hidden;
        &:before{
            content:"${(subProject?.stats?.got/subProject?.stats?.desired)*100}%";
            background:purple;
            height:100%;
            display: block;
            width: ${(subProject?.stats?.got/subProject?.stats?.desired)*100}%;
            display: flex;
            justify-content: center;
            align-items: center;
            color: white;
            box-shadow: 0 0 10px 1px black;
            border-right: 1px dotted black
        }
    `

    return item == "Sanctuaire"
        ? <Default />
        : <article className="money">
            {subProject && <>
                <DivStyled>
                </DivStyled>
                <Stats subProject={subProject} statsIcons={statsIcons} />
                <h4>
                    <span>Un titre temporaire</span>
                    <img src={""} alt="" />
                </h4>
                <p></p>
            </>}
        </article>
}

function Stats({subProject,statsIcons}){
    return <ul>
        <li><span>${statsIcons["start"]}</span>${subProject?.stats?.start}</li>
        <li><span>${statsIcons["desired"]}</span>${subProject?.stats?.desired}</li>
        <li><span>${statsIcons["got"]}</span>${subProject?.stats?.got}</li>
        <li><span>${statsIcons["nbr"]}</span>${subProject?.stats?.nbr}</li>
    </ul>
}

function Default(){
    return <p className="money">
        ...pour l'oeuvre st martin de porrez de Bolobi...
    </p>
}