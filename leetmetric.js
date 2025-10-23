document.addEventListener('DOMContentLoaded', function(){
    const searchBtn = document.getElementById('search-btn')
    const userInput = document.getElementById('user-text')
    const statsContainer = document.querySelector('.stats-container')
    const easyProgressCircle = document.querySelector('.easy-progress')
    const mediumProgressCircle = document.querySelector('.medium-progress')
    const hardProgressCircle = document.querySelector('.hard-progress')
    const easyLabel = document.getElementById('easy-label')
    const mediumLabel = document.getElementById('medium-label')
    const hardLabel = document.getElementById('hard-label')
    const statsCardContainer = document.querySelector('.stats-card')

    // return true or false based on regex
    function validateUsername(username){
        if(username.trim() === ""){
            alert('Username should not be empty !')
            return false;
        }
        const regex = /^[a-zA-Z0-9_-]{1,15}$/
        const isMatching = regex.test(username)
        if(!isMatching) alert('Invalid Username !')
        return isMatching
    }

    async function fetchUserDetails(username) {
        
        try{
            searchBtn.textContent = 'Searching..'
            searchBtn.disabled = true;
            // const response = await fetch(url)
            const proxyUrl = 'https://cors-anywhere-v6qu.onrender.com'
            const targetUrl = 'https://leetcode.com/graphql/'
            const myHeaders = new Headers();
            myHeaders.append("content-type", "application/json")

            const graphql = JSON.stringify({
                query: "\n  query userSessionProgress($username : String!) {\n allQuestionsCount {\n difficulty\n  count\n  }\n matchedUser(username: $username) {\n   submitStats {\n  acSubmissionNum {\n    difficulty\n    count\n  submissions\n    }\n   totalSubmissionNum {\n   difficulty\n   count\n    submissions\n    }\n    }\n  }\n}\n    ",variables: { "username": `${username}` }
            })
            const requestOptions = {
                method: "POST",
                headers: myHeaders,
                body: graphql,
                redirect: "follow"
            }

            const response = await fetch(proxyUrl+targetUrl, requestOptions)
            if(!response.ok){
                throw new Error('Unable to fetch the user details.')
            }
            const parsedData = await response.json()
            console.log('Logging data : ', parsedData);
            displayUserData(parsedData)
            
        }
        catch(error){
            statsContainer.innerHTML = `<p>No data found</p>`
        }
        finally{
            searchBtn.textContent = 'Search'
            searchBtn.disabled = false;
        }
    }

    function updateProgress(solved, total, label, circle){
        const progressDegree = (solved/total)*100
        circle.style.setProperty("--progress-degree", `${progressDegree}%`)
        label.textContent = `${solved}/${total}`
    }

    function displayUserData(parsedData){
        const totalQues = parsedData.data.allQuestionsCount[0].count
        const totalEasyQues = parsedData.data.allQuestionsCount[1].count
        const totalMediumQues = parsedData.data.allQuestionsCount[2].count
        const totalHardQues = parsedData.data.allQuestionsCount[3].count
        const totalSolvedQues = parsedData.data.matchedUser.submitStats.acSubmissionNum[0].count
        const totalSolvedEasyQues = parsedData.data.matchedUser.submitStats.acSubmissionNum[1].count
        const totalSolvedMediumQues = parsedData.data.matchedUser.submitStats.acSubmissionNum[2].count
        const totalSolvedHardQues = parsedData.data.matchedUser.submitStats.acSubmissionNum[3].count

        updateProgress(totalSolvedEasyQues, totalEasyQues, easyLabel, easyProgressCircle)
        updateProgress(totalSolvedMediumQues, totalMediumQues, mediumLabel, mediumProgressCircle)
        updateProgress(totalSolvedHardQues, totalHardQues, hardLabel, hardProgressCircle)

    }
    searchBtn.addEventListener('click', function(){
        const username = userInput.value
        console.log(username);
    if(validateUsername(username)){
        fetchUserDetails(username)
    }

    })
})