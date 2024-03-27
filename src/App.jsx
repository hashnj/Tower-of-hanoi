import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [discs, setDiscs] = useState(3)
  const [tower, setTower] = useState([[3,2,1],[],[]])
  const [selected,setSelected]=useState(undefined);
  useEffect(()=>{
    let arr=Array.from({length:discs},(_, index) => index + 1)
    // console.log(arr)
    setTower([arr,[],[]])
  },[discs])

  function handleClick(i){
    if(selected!==undefined){
      const nT=[...tower]
      if(nT[selected].length<=0) {
        alert("noooo!!!");
        setSelected(undefined);
        return;
      }
      
      if(nT[selected][nT[selected].length-1]<nT[i][nT[i].length-1]){
        alert("noooo!!!");
        setSelected(undefined);
        return;
      }
      const poped=nT[selected].pop();
      console.log(poped)
      nT[i].push(poped);
      console.log(nT[2])
      if(i==2){
        console.log(nT[2].length)
        if(nT[2].length===discs){
          alert("you won!!!!!!!!!!!!!!!!!!!!!!!! yay!!!")
          location.reload();
        }
      }
      setTower(nT);
      setSelected(undefined);
    }
    else{
      setSelected(i)
    }
  }

  return (
    <div className='flex flex-col w-full justify-center items-center min-h-screen bg-slate-500'>
      <div className='font-bold text-3xl absolute p-3 top-0'>Tower of Hanoi</div>
      <div className='flex justify-between '>
      {tower.map((diss,i)=>(
        
        <div onClick={()=>{handleClick(i)}}  className={'cursor-pointer p-10 flex justify-between w-32 '+(selected==i ? 'selected':'')} key={i}>
          {console.log(discs,diss,i)}
          <div className={'line bg-black'}>
            <div className='discs'>
            {diss.map((i,j)=>(
              <div key={j} className='dsk' style={{width:`${100-i*10}px`}}></div>
            ))}
            </div>
          </div>
        </div>
      ))}
      </div>
      <div className='flex text-xl'> Number of discs:<input className='bg-slate-400 w-7 text-black text-xl placeholder-black'  type="number" min={3} max={8} placeholder={'3'} onChange={(e)=>{
        setDiscs(parseInt(e.target.value))
      }}/>
      </div>
    </div>
  )
}

export default App
