import { useState } from 'react'
import "./styles.css"

function App() {
  const [basePrice,setBasePrice] = useState("");
  const [packageCount, setPackageCount] = useState("");
  const [packages, setPackages] = useState([]);
  const [data,setData] = useState([]);
  const [loading, setLoading] = useState(true);
  

  const handlePackageCount = (e) => {
    const count = Number(e.target.value);
    setPackageCount(count);
    const arr = [];
    for (let i = 0; i < count; i++) {
      arr.push({
        id: i+1,
        weight: "",
        distance: "",
        offerCode: "",
      });
    }
    setPackages(arr);
  };

  const updatePackage = (index, field, value) => {
    const updated = [...packages];
    updated[index][field] = value;
    const wt = updated[index]["weight"];
    const dist = updated[index]["distance"];
    updated[index]["offerCode"] = calculateOffer(wt,dist);
    setPackages(updated);
  };

  const calculateOffer = (wt,dist) =>{
            let offerCode = "";
            if(dist<200 && (wt>=70 && wt<=200)){
                offerCode = "OFR10";
            }else if((dist>=50 && dist<=150) && (wt>=100 && wt<=250)){
                offerCode = "OFR07";
            }else if((dist>=50 && dist<=250) && (wt>=10 && wt<=150)){
                offerCode = "OFR05";
            }else{
              offerCode = "No Offer Code Applicable";
            }
            return offerCode
  }

  const sendData = async(e) =>{
  e.preventDefault()
  const res = await fetch("https://backend-courierservice.onrender.com/calculate",{
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
  basePrice, packageCount, packages
  })
});

const data = await res.json();
setData(data.results);
setLoading(false);
  }


  return (
    <div className='container'>
      <h1 className='title'>Courier Service</h1>
      <form onSubmit={sendData} className='form'>
        <div className='row'>
            <div className='field'>
              <label htmlFor="">Enter Base Delivery Cost:</label>
              <input type="text" value={basePrice} onChange={e=>setBasePrice(e.target.value)} />
            </div>   
            <div className='field'>
              <label htmlFor="">Number of packages:</label>
              <input type="number" value={packageCount} onChange={handlePackageCount}/>
            </div>
        </div>
        {packages.map((pkg, index) => (
          <div className="package-card" key={index} >
            <h3>Package {index + 1}</h3>
            <div className='row'>
              <div className='field'>
                  <label>Package ID</label>
                  <input
                  type="number"
                  value={index+1}
                  readOnly
                  />
              </div>
              <div className='field'>
                <label>Weight (kg)</label>
                <input
                type="number"
                value={pkg.weight}
                onChange={(e) =>
                  updatePackage(index, "weight", e.target.value)
                }
              />
              </div>
            </div>            
            <div className="row">
              <div className="field">
                <label>Distance (km)</label>
                <input
                  type="number"
                  value={pkg.distance}
                  onChange={(e) =>
                    updatePackage(index, "distance", e.target.value)
                  }
                />
              </div>
              <div className="field">
                  <label>Offer Code</label>
                  <input
                    type="text"
                    value={pkg.offerCode}  
                    readOnly                  
                  />
              </div>
            </div>
            <hr />
          </div>
        ))}
        
          <button type="submit" className='submit-btn'>Submit</button>
        {
          data && (
            data.map((item,index)=>(
              <ul className='result' key={index}>
                 <li>PackageID: {item.packageId}</li>
                  <li>Discount: {item.discount}</li>
                <li>FinalCost: {item.costAfterDiscount}</li>
              </ul> 
            ))
          )
        }
      </form>
    </div>
  )
}

export default App
