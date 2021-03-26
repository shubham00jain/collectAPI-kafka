const getRecentResponse = async (formID, Secret, httpClient) => {
    try{
        const res = await httpClient.get(`https://collect-api.atlan.com/v1/responses?where={"formId":${formID}}&sort=-_created_at`, {
            headers: {
                'Authorization' : `Bearer ${Secret}`
            }
        })
        
        const recentResponse = res.data['_items'][0]['answers'];
        console.log(recentResponse);
        return recentResponse; 
    }
    
    catch(err){
        console.error(err);
    }
}

exports.getRecentResponse = getRecentResponse;