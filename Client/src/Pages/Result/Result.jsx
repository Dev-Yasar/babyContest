import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Result.css";
import "./loder.css";
import baby from "../../Assets/images/baby.jpg";
import { Link } from "react-router-dom"
const Result = () => {
  const [babyList, setBabyList] = useState([]);
  const [hbaby, setHbaby] = useState(null);
  const [refreshCount, setRefreshCount] = useState(0);

  // const [imageSource, setImageSource] = useState(baby);
  // const [headingText, setHeadingText] = useState('baby Name');
  // const [votecount, setVotecount] = useState('0');

  const fetchBabies = async () => {
    setTimeout(async () => {
      const res = await axios.get("https://babycontest.onrender.com/votes");
      setBabyList(res.data);
      const maxVoteObject = getObjectWithMaxVote(babyList);

      setHbaby(maxVoteObject);
      console.log(hbaby);
      setRefreshCount((prevCount) => prevCount + 1);
    }, 1000);
  };

  useEffect(() => {
    if (refreshCount < 10) {
      fetchBabies();
    }
  }, [refreshCount]);

  function getObjectWithMaxVote(data) {
    return data.reduce((maxVoteObject, currentItem) => {
      return currentItem.vote > maxVoteObject.vote
        ? currentItem
        : maxVoteObject;
    }, data[0]);
  }

  if (!hbaby) {
    return (
      <div className="loderContainer">
         <Link to="/vote"><button className="routeBtn">Vote Page</button></Link>
        <div class="loader"></div>
        <p className="dataRedeing">Please Wait..</p>
      </div>
    );
  }

  return (
    <div className="Background">
            <Link to="/result"><button className="routeBtn">Vote Page</button></Link>
      <div className="WholeDataHolder">
        <div className="OneBabyData">
          <div className="babyData1">
            <div className="BabyImgHolder">
              <img className="BabyImg" src={hbaby.imageLinks[0]} alt="img" />
            </div>
            <div>
              <h2 className="BabyName">{hbaby.name}</h2>
            </div>
            <div className="VoteCount">
              <h2> No of Votes : {hbaby.vote} </h2>
            </div>
          </div>
        </div>

        <div className="FullList">
          <div className="BabyListmain">
            <div>
              <h4>photo</h4>
            </div>
            <div>
              <h3>Baby Name</h3>
            </div>
            <div>
              <h4>Votes</h4>
            </div>
          </div>

          {babyList.map((BList) => (
            <div key={BList.id} className="BabyList">
              <div className="LinkImgHolder">
                <img className="linkImg" src={BList.imageLinks[0]} alt="" />
              </div>
              <div>
                <p>{BList.name}</p>
              </div>
              <div>
                <p>{BList.vote}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Result;
