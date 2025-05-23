document.addEventListener("DOMContentLoaded", function()
{
    const searchButton = document.getElementById("search-btn");
    const usernameInput = document.getElementById("user-input");
    const statsContainer = document.querySelector(".stats-box");
    const easyProgressCircle = document.querySelector(".easy-progress");
    const mediumProgressCircle = document.querySelector(".medium-progress");
    const hardProgressCircle = document.querySelector(".hard-progress");
    const easyLabel = document.getElementById("easy-label");
    const mediumLabel = document.getElementById("medium-label");
    const hardLabel = document.getElementById("hard-label");
    const cardStatsContainer = document.querySelector(".stats-cards");
    
    // check if the username is valid or not
    function validateUsername(username){
        if(username.trim() === ""){
            alert("Oops!, Username cannot be empty.");
            return false;
        }

        const regex = /^[a-zA-Z0-9_-]{1,15}$/;

        const isMatching  = regex.test(username);
        if(!isMatching){
            alert("Invalid Username");
        }
        return isMatching;
    }


    // for fetching user details through API
    async function fetchUserDetail(username)
    {
        const url = `https://leetcode-stats-api.herokuapp.com/${username}`
        try{
            searchButton.textContent = "Searching...";
            searchButton.disabled = true;
            const response = await fetch(url);
            if(!response.ok){
                  throw new Error("Unable to fetch details");
            }
            const pdata = await response.json();
            console.log("Logged Data :", pdata);

            displayUserData(pdata);
        }
        catch(error){
           // console.log("NO DATA FOUND");
            statsBox.innerHTML = `<p>${error.message}</p>`
        }
        finally {
            searchButton.textContent = "Search";
            searchButton.disabled = false;
        }
    }
     


    //  updating progress box
    function updateProgress(solved, total, label, circle){
         const progressDegree = (solved/total)*100;
         circle.style.setProperty("--progress-degree", `${progressDegree}%`);
         label.textContent = `${solved}/${total}`;
         console.log(label);
    }


    // displaying user data in stats box
    function displayUserData(pdata){
        const totalQues = pdata.totalQuestions;
        const totalHardQues = pdata.totalHard;
        const totalEasyQues = pdata.totalEasy;
        const totalMediumQues = pdata.totalMedium;

        const totalQuesSolved = pdata.totalSolved;
        const totalEasySolved = pdata.easySolved;
        const totalMediumSolved = pdata.mediumSolved;
        const totalHardSolved = pdata.hardSolved;
 
        updateProgress(totalEasySolved, totalEasyQues, easyLabel, easyProgressCircle);
        updateProgress(totalMediumSolved, totalMediumQues, mediumLabel, mediumProgressCircle);
        updateProgress(totalHardSolved, totalHardQues, hardLabel, hardProgressCircle);
        
        const cardData =[
            {label: "Total Submissions", value:pdata.totalSolved},
            {label: "Total Easy Submissions", value:pdata.easySolved},
            {label: "Total Medium Submissions", value:pdata.mediumSolved},
            {label: "Total Hard Submissions", value:pdata.hardSolved},
            {label: "Acceptance Rate(in %)", value:pdata.acceptanceRate},
            {label: "Rank", value:pdata.ranking}
        ];
        console.log(cardData);

        cardStatsContainer.innerHTML =cardData.map(
            data=>
                   `<div class="card">
                   <h3>${data.label}</h3>
                   <p>${data.value}</p>
                   </div>`
        ).join("")
    }

    
    // activating search button
    searchButton.addEventListener('click',function() 
    { 
        const username = usernameInput.value;
        console.log("username_login :", username);
        if(validateUsername(username)){
            fetchUserDetail(username);
        }
    })

})