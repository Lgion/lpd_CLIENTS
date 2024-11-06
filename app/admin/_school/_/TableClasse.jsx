
export default () => {
    const {renderClasse} = useContext(AdminContext)

    
    return <>
        {renderClasse.length !== 0 && <table>
        <thead>
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