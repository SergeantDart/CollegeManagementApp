import NewsSlider from "../components/NewsSlider";
import React from "react";
import Statistics from "../components/Statistics";

const Dashboard = () => {

    return (
        <div class="dashboard">
            <NewsSlider
                type="featured"
                start={0}
                amount={4}
                settings={{
                    dots: false
                }}
            />
            <Statistics/>
        
        </div>

    );
}


export default Dashboard;