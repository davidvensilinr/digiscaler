import React from "react";
import "./ProfileCard.css";

const ProfileCard = ({ type, data, onDealClick }) => {
  return (
    <div className="profile-card">
      <img
        src={data.image}
        alt="Profile"
        className="profile-image"
      />
      <h3>{data.name}</h3>

      {type === "creator" ? (
        <>
          <div className="platform-links">
            {data.platforms?.map((p, i) => (
              <a href={p.link} key={i} target="_blank" rel="noreferrer">
                {p.platform}
              </a>
            ))}
          </div>
          <p>Service: {data.serviceType}</p>
          <p>Rate: ₹{data.rate}</p>
          <p>Followers: {data.followers}</p>
        </>
      ) : (
        <>
          <p>Location: {data.location}</p>
          <p>Product: {data.productDescription}</p>
          <p>Reach: {data.reach}</p>
          <p>Budget: ₹{data.budget}</p>
        </>
      )}

      <button onClick={onDealClick}>Deal</button>
    </div>
  );
};

export default ProfileCard;
