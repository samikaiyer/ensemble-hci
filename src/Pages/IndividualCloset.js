import React from "react";
import { useParams } from "react-router-dom";
import closetsData from "../closets.json";
import ScreenHeader from "../components/ScreenHeader";

function IndividualCloset() {
    const { name } = useParams();
    const closet = closetsData.closets.find(c => c.title === decodeURIComponent(name));

    if (!closet) {
        return <h2>Closet not found</h2>;
    }

      return (
        <div>
            <ScreenHeader text={closet.title} />
        </div>
      );
}

export default IndividualCloset;