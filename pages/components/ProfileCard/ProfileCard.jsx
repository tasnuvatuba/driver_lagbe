import axios from "axios";
import React, { useEffect, useState } from 'react';
import './ProfileCard.css'
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as fasStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons';
import { faStarHalfAlt as fasStarHalfAlt } from '@fortawesome/free-solid-svg-icons';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { useRouter } from 'next/router';
import { Avatar, Box, Center, Heading, Text, Divider, Button, useToast, Flex, VStack} from '@chakra-ui/react';
import Link from 'next/link';

// Add the star icons to the Font Awesome library
library.add(fasStar, farStar, fasStarHalfAlt);


const ProfileCard = ({img, name, desc, rating, fare, status, source, srcPage, srcAddr, destAddr, tripType, username, pickUpTime}) => { //name-> driver username, username -> owner username
  
  const [isClicked, setIsClicked] = useState(false);
  const toast = useToast();
  
  const now = new Date();
  const options = { 
    dateStyle: 'full', 
    timeStyle: 'long' 
  };
  const time = now.toLocaleString(undefined, options);

  const getStatusColor = (status) => {
    if (status == 1) {
      return 'green';
    } else {
      return 'red';
    }
  };

  
  console.log("ProfileCard: ",name, srcPage, srcAddr, destAddr, tripType, username);

  const statusColor = getStatusColor(status);

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating - fullStars >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    console.log("rating " + rating)

    const stars = [];

    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FontAwesomeIcon key={i} icon={fasStar} />);
    }

    // Add half star if applicable
      if (halfStar) {
      stars.push(<FontAwesomeIcon key="half" icon={fasStarHalfAlt} />);
    }

    // Add empty stars
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FontAwesomeIcon key={`empty-${i}`} icon={farStar} />);
    }

    
    return stars;
  };

  const starIcons = renderStars(rating);

  const router = useRouter();

  const handleAboutMeClick = () => {
    router.push({
      pathname: '/Profile',
      query: { driverUsername: name, srcPage: srcPage, srcAddr: srcAddr, destAddr: destAddr, tripType: tripType, ownerUsername: username }
    })
  };

  const handleSendRequest = () => {
    setIsClicked(true);

        axios({
            method: 'post',
            withCredentials: true,
            data: {
              driverUsername: name,
              ownerUsername: username,
              source: srcAddr,
              destination: destAddr,
              typeOfTrip: tripType,
              time: time,
              status: "pending",
              pickUpTime: pickUpTime

            },
            url: 'http://localhost:3001/sendRequest'
          })
            .then(res => {
                if(res.data == "success"){
                toast({
                    title: 'Success',
                    description: "Request sent successfully",
                    status: 'success',
                    duration: 5000,
                    isClosable: true,
                });
                }
                else{
                toast({
                    title: 'Error',
                    description: "Error occcured",
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });

                }
                
            })
            .catch(err => {
                console.log(err);
            })
  };

  return(
    

      <div className="card">
        <div className="card-content">
          <div className="image">
            <img src="/1.jpg" alt=""/>
          </div>

         

          <div className="name-desc">
            <div className="status-circle" style={{ backgroundColor: statusColor }}></div>
            <span className="name">{name}</span>
            {/* <span className="desc">{desc}</span> */}
            <span className="fare">TK {fare}/hour</span>
          </div>

          <div className="rating">{starIcons}</div>

          {source !== 'Header' && (
          <div className="Button">
            <button className="aboutMe" onClick={handleAboutMeClick}>
              View Profile 
            </button>
            {!isClicked ? (<button className="aboutMe" onClick={handleSendRequest}>Send Request</button>)
            :(<Text color='green.400'>Request Sent!</Text>)}
            
            
            
          </div>
        )}
        </div>
      </div>

  
                    
  );

};

export default ProfileCard





