const formatNumber = (number) => Intl.NumberFormat('id-ID').format(number)

const showData = (data) => {
    let total = document.getElementById("total")
    let vaksin1 = document.getElementById("vaksin-1")
    let vaksin2 = document.getElementById("vaksin-2")

    total.textContent = formatNumber(data.totalsasaran) 
    vaksin1.textContent = formatNumber(data.vaksinasi1) 
    vaksin2.textContent = formatNumber(data.vaksinasi2) 
}

try {
    fetch ("http://vaksincovid19-api.vercel.app/api/vaksin")  
    .then(function(result){
        return result.json()
    })
    .then(function(result){
        showData(result)
    }) 
} catch (error) {
    
}