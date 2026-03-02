import {eventdata} from "../assets/eventdata"
const Newfile = () => {
   
 const categories = [
  { name: "Recliner", startRow: 0, endRow: 2, price: 250 },
  { name: "Balcony", startRow: 3, endRow: 11, price: 180 },
  { name: "Lower Class", startRow: 12, endRow: 14, price: 130 },
];

return(
   <div className="flex flex-col">
      <button className="p-2 m-2 border hover:bg-amber-400 rounded-lg bg-gray-400 text-black"> press me  </button>
      
      {categories.map((cat) => (
         <div key={cat.name}> {cat.price} </div>
      ))
      }

      {eventdata.map((event) => (
         <div key={event.id}> {event.title} <img className="w-50 h-50" src={event.poster}/></div>
      ))
      }
   </div>
)
}

export default Newfile
