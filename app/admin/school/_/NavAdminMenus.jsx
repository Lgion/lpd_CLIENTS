
export default () => {
    const {MembersMenu,YearsList,ClassesList} = useContext(AdminContext)

    
    return <nav id="adminMenus">
        <MembersMenu />
        <YearsList />
        <ClassesList data={ecole_classes.filter(elt => elt.annee == year)} />
    </nav>
}