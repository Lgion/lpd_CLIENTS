// import { useContext } from 'react'
// import AdminContext from "../../../../stores/adminContext.js"
// import '../styles/table-classe.css'

export default ({renderClasse}) => {
    // const {renderClasse} = useContext(AdminContext)

    
    return <>
        {renderClasse.length !== 0 && <table className="table table-striped table-hover table-bordered">
        <thead className="table-dark">
            <tr>
            <th>LABEL</th>
            <th>VALUE</th>
            </tr>
        </thead>
        <tbody>
            {/* {JSON.stringify(classe)}
            - 
            {JSON.stringify(renderClasse)} */}
            {renderClasse}
        </tbody>
        </table>}
    </>
}