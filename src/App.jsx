import { useEffect, useState } from 'react'
import './App.css'

function App() {
  
  return (
    <>
    <Game ></Game>
    </>
    
  )
}

function Game(){
  const [discs, setDiscs] = useState(3)
  const [tower, setTower] = useState([[3,2,1],[],[]])
  const [selected,setSelected]=useState(undefined);
  const [won,setWon]=useState(false);
  const [helpp,setHelp]=useState(false);
  const [btn,setBtn]=useState(false);
  const [score,setScore]=useState(0);
  const [mini,setMini]=useState(0);
  useEffect(()=>{
    let arr=Array.from({length:discs},(_, index) => index + 1)
    setMini(2**discs-1);
    setTower([arr,[],[]])
    setScore(0);
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
      nT[i].push(poped);
      setScore(s=>s+1);
      if(selected==i){
        setScore(s=>s-1);
      }
      if(i==2){
        if(nT[2].length===discs){
          setWon(true);
        }
      }
      setTower(nT);
      setSelected(undefined);
    }
    else{
      setSelected(i)
    }
  }

  return(
    <>
    <div className='outr'>
      <div className="layer"></div>
      <div className='card'>
      <div className='absolute p-3 top-0 h'>Tower of Hanoi</div>
      
      <div className="a absolute shadow-lg shadow-gray-500/40 top-[15vh] md:top-[20vh] text-xl p-3">Minimum-step Solution with {discs} Discs has {mini} steps </div>
      <div className="a absolute shadow-lg shadow-gray-500/40 bottom-[15vh] md:bottom-[20vh] text-xl p-3">Number of moves: {score} </div>
      {btn &&
      <div className="absolute  shadow-lg rounded-lg shadow-indigo-500/90 bottom-[6vh] md:bottom-[12vh] text-xl p-3"><button onClick={()=>{ const inp=document.querySelector('.inp');
        setDiscs(d=>d+1);
        inp.value=discs;
      setBtn(false)}}>Disc+1</button> </div>}
      <div className="how"><button onClick={()=>{setHelp(true);}}><i className="fa fa-question-circle" aria-hidden="true" ></i></button></div>
      <div className='flex justify-between '>
      {tower.map((diss,i)=>(
        
        <div onClick={()=>{handleClick(i)}}  className={'cursor-pointer p-10 flex justify-center w-32 '+(selected==i ? 'selected':'')} key={i}>
          
          <div className={'line bg-black'}>
            <div className='discs'>
            {diss.map((i,j)=>(
              <div key={j} className='dsk' style={{width:`${100-i*10}px`}}></div>
            ))}
            </div>
            <div className="linee"></div>
          </div>
        </div>
      ))}
      </div>
      <div className='flex text-xl'> Number of discs:<input className='inp w-7 text-black text-xl placeholder-black'  type="number" min={3} max={8} placeholder={'3'} onChange={(e)=>{
        setDiscs(parseInt(e.target.value))
      }}/>
      </div>
      <p className='t text-gray-300 hover:text-gray-400 relative -left-9'>you can change the number of disks ^ here</p>
    </div>
    </div>
    {won &&
    <div className='background'>
        
    <div className="container">
      <div>YAY!!!{mini==score? "Perfrct Score":"level completed"}</div>
      <div className='buttonss'>
        <button onClick={()=>{
          setWon(false)
          setBtn(true)
          }}>Ok</button>
        <button onClick={()=>{
        const inp=document.querySelector('.inp');
        setDiscs(d=>d+1);
        inp.value=discs;
        setWon(false);
        }}>Continue</button>
      </div>
    </div>
  </div>}
  {helpp &&
  <div className='background'>
  <div className="containerr">
    <div className="how z-30"><button onClick={()=>{setHelp(false)}} ><i class="fa fa-times" aria-hidden="true"></i></button></div>
    <div className='inn p-6'>
      <h1 className='text-5xl pb-6 underline'>Help</h1>
    Before getting started, let’s talk about what the Tower of Hanoi problem is. Well, this is a fun puzzle game based on the Tower of Hanoi Algorithm in DSA where the objective is to move an entire stack of disks from the source position to another position. Three simple rules are followed:
    <ul>
<li>Only one disk can be moved at a time.</li>
<li>Each move consists of taking the upper disk from one of the stacks and placing it on top of another stack. In other words, a disk can only be moved if it is the uppermost disk on a stack.</li>
<li>No larger disk may be placed on top of a smaller disk.</li></ul>
<br /><hr /><br />
Here, We have levels 3-8 <br />
** And the 8th level having 8 disks takes 255 steps at minimum. **
    </div>
    </div>
    </div>
    }


  </>
  )
}



export default App
