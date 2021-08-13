const formatNumber = (number) => Intl.NumberFormat('id-ID').format(number)

const setIndonesiaData = (data) => {
    const positive = document.getElementById('covid-positive')
    const sembuh = document.getElementById('covid-sembuh')
    const meninggal = document.getElementById('covid-meninggal')
    
    positive.textContent = formatNumber(data.confirmed.value)
    sembuh.textContent = formatNumber(data.recovered.value)
    meninggal.textContent = formatNumber(data.deaths.value)
}

const getIndonesiaData = () => {
    try {
        fetch('https://covid19.mathdro.id/api/countries/Indonesia')
            .then(res => res.json())
            .then(json => setIndonesiaData(json))
    } catch (error) {
        console.log(error)
    }
}

getIndonesiaData()