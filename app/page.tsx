'use client'
import { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";

import "./page.css";
import LineChart from "./lineChart";
import Loading from "./loading";

export interface BlockBaseGasProps{
  id: number,
  baseGas: string,
  timestamp: string
}

export default function Home() {
  
  // Storing latest 25 blocks
  const [idBaseGas,setIdBaseGas] = useState<BlockBaseGasProps[]>([]);
  const [latestBaseGas,setLatestBaseGas] = useState<string>();
  const [option,setOption] = useState<string>("Default");
  const [loading,setLoading] = useState<boolean>(true);
  const [isError,setIsError] = useState<boolean>(false);

  async function getDefaultGases(){
    setIsError(false)
    setLoading(true);
    setIdBaseGas([]);
    try{
      const response = await axios.get(`http://localhost:3001/api/blocks-default`)
      const data: BlockBaseGasProps[] = response.data.data;
      setLatestBaseGas(data[data.length-1].baseGas.substring(0,data[data.length-1].baseGas.indexOf('.')))
      setIdBaseGas(data);
     
      setLoading(false);
    }
    catch(err){
      console.error(err);
      setLoading(false);
      setIsError(true);
    }
  }

  async function getBlocksOnTimeStamp(oldTimeStamp: number){
    setIsError(false)
    setLoading(true);
    setIdBaseGas([]);
    try{
      const response = await axios.get(`http://localhost:3001/api/blocks-timestamp/${oldTimeStamp}`)
      const data: BlockBaseGasProps[] = response.data.data;
      setLatestBaseGas(data[data.length-1].baseGas.substring(0,data[data.length-1].baseGas.indexOf('.')))
      setIdBaseGas(data);
     
      setLoading(false);
    }
    catch(err){
      console.error(err);
      setLoading(false);
      setIsError(true)
    }
    
  }

  function handleOptionChange(newValue:string){
    if(option !== newValue){
      setOption(newValue);
      if(newValue === "Default"){
        getDefaultGases();
      }
      else{
        let time:Date;
        let unixTime:number;
        let currentTime = new Date();
        switch(newValue){
          case "15Min":
            time = new Date(currentTime.getTime() - 15 * 60 * 1000);
            unixTime = Math.floor(time.getTime() /1000);
            getBlocksOnTimeStamp(unixTime);
            break;
          case "1Hr":
            time = new Date(currentTime.getTime() -  60 * 60 * 1000);
            unixTime = Math.floor(time.getTime() /1000);
            getBlocksOnTimeStamp(unixTime);
            break;
          case "1Day":
            time = new Date(currentTime.getTime() - 24*60 * 60 * 1000);
            unixTime = Math.floor(time.getTime() /1000);
            getBlocksOnTimeStamp(unixTime);
            break;
        }
      }
    }
  }


  function getLatestBaseGas(){
    setIsError(false);
    const socket = io('ws://localhost:3001');
    window.onbeforeunload = function(e) {
      socket.emit("end");
      socket.disconnect();
    };
    if(socket.connected)
      console.log("Socket.io Connected");

    socket.on("newBlock",(latestBlock)=>{
      setIsError(false);
      const data = JSON.parse(latestBlock)
      setLatestBaseGas(data.baseGas.substring(0,data.baseGas.indexOf('.')))
      setIdBaseGas((arr)=>arr.slice(1));
      setIdBaseGas(arr => [...arr,{
        id:Number(data.id),
        baseGas:data.baseGas,
        timestamp: data.timestamp
      }])
    })
  }


  useEffect(()=>{
    getDefaultGases();

    // Set up live listener to get latest block and update
    getLatestBaseGas();
  },[])

  return (
   <div>
    <div className="component">
      <header>
        <span>Network Fee</span>            
        <select name="duration" id="option" onChange={(e)=>handleOptionChange(e.target.value)} value={option}>
          <option>Default</option>
          <option>15Min</option>
          <option>1Hr</option>
          <option>1Day</option>
        </select>
      </header>
      {loading ? <Loading /> : isError? 
        (
          <div style={{display: "flex",alignContent: "center",justifyContent: "center"}}>
            <img src="/danger.png" alt="Danger" width={"100px"} />
          </div>
        ):
        (
        <>
          <div>
            <p><span className="gasFee">{latestBaseGas}</span> <span>gwei</span></p>
            <p className="baseFeeText">Current Base Fee</p>
          </div>
          <div>
            <LineChart 
              points = {idBaseGas}
            />
          </div>
        </>
        )        
      }

      
     </div>       
   </div>
  )
}
