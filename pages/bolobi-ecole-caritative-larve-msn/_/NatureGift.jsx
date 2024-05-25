


export default function NatureGift() {

    const nature_gifts = {
      riz: "Riz (25kg) --- 500F / kg"
      , manuel_scolaire: "Manuels scolaires (10 élèves) --- "
      , tenu_scolaire: "Tenus scolaire (10 élèves)"
      // , habits: "Vêtements (chaussures, t-shirts, shorts, etc...)"
    }
    let a,nature_arr=[]

    for(a in nature_gifts)nature_arr.push(<fieldset key={a} className="safe nature_predefined nature">
        <input id={a} name={a} type="number" defaultValue="0" />
        <label htmlFor={a}>
          {nature_gifts[a]}
        </label>
    </fieldset>)

    return <>
      
        <p className="nature">
          <div>
            Les dons étants à l'attention de l'École caritative E(S)MP du sancturaire NDR de Bolobi
            , 3 catgories de besoin nous préocupent:
          </div>
          <ul>
            <li>Alimentaire</li>
            <li>Sanitaire</li>
            <li>Scolaire</li>
          </ul>
          <div>Vous pouvez ci-dessous: </div>
          <ul>
            <li>Donner une simple liste écrite (ou une photo, ou un screenshot d'un document)</li>
            <li>Ou sélectionner ci-dessous, parmis ces 3 catégories contenants nos besoins
              , les articles et les quantités dont vous souhaitez nous faire don.</li>
              <li>Il est possible d'acheter directement les articles ici, en passant l'article de "promesse" à "solvé"</li>
          </ul>
          <div>à vos marques, prêts? partez!</div>
        </p>
        <section className="nature">
          <ul>
            <li className="active">M</li>
            <li>H</li>
            <li>I</li>
            <li>P</li>
            {/* onClick=(item,i) => {
              
            } */}
          </ul>
          <p>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Dolorem doloribus reiciendis aut quis velit natus. Quod asperiores totam quo deserunt optio similique delectus ipsum vero alias. Nobis beatae quia rerum.
          </p>
          <fieldset className="nature">
            <textarea className="nature" id="nature" name="nature"></textarea>
            <label className="nature" htmlFor="nature">Nature</label>
          </fieldset>
          <label>
            <input type="file" name="nature_msg_file" />
            <span>Aucun fichier chargé..</span>
          </label>
          <hr />
          <p>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Laborum ipsam quas amet et aliquam at sequi optio provident! Fuga reiciendis exercitationem deleniti ab veritatis amet eos labore temporibus enim modi?
          </p>
          <fieldset>
            <select name="nature_select">
              <option value="">Catégorie <b>...</b></option>
            </select>
            <input type="text" readOnly />
          </fieldset>
          <ul className="cards">
            <li className="card">
              {/* img */}
              {/* h4 */}
              {/* p */}
              {/* div>button*2ou3 */}
            </li>
          </ul>
        </section>
        {/* {nature_arr} */}
    </>
}