
let provinces = []
let cities = []
let prov_id = null

const getProvinces = () => {
    try {
        fetch('https://rs-bed-covid-api.vercel.app/api/get-provinces')
            .then(res => res.json())
            .then(json =>{ 
                provinces = json.provinces
            })
    } catch(error) {
        console.log(error)
    }
}
getProvinces()



const inputProvince = document.getElementById('inputProvinsi')
const autoProvince = document.getElementById('autoProvinsi')
inputProvinsi.addEventListener('keydown' , (e) => {
    if(inputProvince.value !== '') {
        autoProvince.style.display = 'block'
    } else {
        autoProvince.style.display = 'none'
    }
    
    let list_province = provinces.filter(data => {
        if(data.name.toLowerCase().includes(inputProvinsi.value.toLowerCase())) {
            return data
        }
    })

    if(list_province.length > 5) { list_province.length = 5 }
    
    let result = ``
    list_province.forEach(data => {
        result += `
            <li data-id="${data.id}" class="px-4 py-2 cursor-pointer hover:bg-gray-100  transition duration-200" >${data.name}</li>
        `
    })
    autoProvince.innerHTML = result
})

autoProvince.addEventListener('click' , async (e) => {
    let province_id = e.target.getAttribute('data-id')
    inputProvince.value = e.target.textContent
    autoProvince.style.display = "none"

    try {
        let data_cities  = await fetch(`https://rs-bed-covid-api.vercel.app/api/get-cities?provinceid=${province_id}`)
                    .then(res => res.json())
                    .then(json => json.cities)

        cities = data_cities
    } catch(error) {
        console.log(error)
    }
    
    prov_id = province_id
})


const inputCity = document.getElementById('inputKota')
const autoCity = document.getElementById('autoKota')

inputCity.addEventListener('keydown' , (e) => {
    let list_cities = cities.filter(data => {
        if(data.name.toLowerCase().includes(inputCity.value.toLowerCase()))
            return true
    })

    if(list_cities.length > 5) { list_cities.length = 5 }

    let result = ``
    list_cities.forEach(data => {
        result += `
            <li data-id="${data.id}" class="px-2 py-2 cursor-pointer hover:bg-gray-100 transition duration-200">${data.name}</li>
        `
    })
    autoCity.innerHTML = result
})


const setHospitalElement = async (prov_id , city_id) => {

    try {
        let list_hospitals = await fetch(`https://rs-bed-covid-api.vercel.app/api/get-hospitals?provinceid=${prov_id}&cityid=${city_id}&type=1`)
                                .then(res => res.json())
                                .then(json => json.hospitals)

        const listData = document.getElementById('listData')
        console.log(list_hospitals)
        let result = ``
        list_hospitals.forEach(data => {
            result += `
                <div class="w-full md:w-1/3 p-4">
                    <div class="shadow-md h-full p-4 rounded-lg">
                        <h5 class=" font-semibold text-xl text-green-400">${data.name}</h5>
                        <h5 class=" font-bold text-red-400">${data.phone}</h5>
                        <h6 class=" text-black-400 text-sm">${data.address}</h6>
                        <div class="flex items-center justify-between mt-3">
                            <div class="flex items-center">
                                <img src="/assets/image 1.png" class="pl-1 w-8 inline-block"/>
                                <span class="font-semibold text-yellow-400 ml-2">${data.bed_availability} bed</span>
                            </div>
                            <button data-id="${data.id}" class="bg-blue-400 hover:bg-blue-500 transition duration-200 text-white font-semibold py-1 rounded px-4 text-sm inline-block">detail</button>
                        </div>
                    </div>
                </div>
            `
        })  
    
        listData.innerHTML = result
    } catch(error) {
        console.log(error)
    }

}



autoCity.addEventListener('click' , async(e) => {
    let city_id = e.target.getAttribute('data-id')
    inputCity.value = e.target.textContent
    autoCity.style.display = 'none'

    setHospitalElement(prov_id , city_id)
})






const listData = document.getElementById('listData')
const modalDetail = document.getElementById('modalDetail')
const btnClose = document.getElementById('btnClose')

btnClose.addEventListener('click' , () => {
    modalDetail.style.opacity = 0
    modalDetail.style.pointerEvents = 'none'
})

listData.addEventListener('click' , async (e) => {
    let tag = e.target.tagName
    if(tag === "BUTTON") {
        let hospital_id = e.target.getAttribute('data-id')
        let detail_hospital = await fetch(`https://rs-bed-covid-api.vercel.app/api/get-bed-detail?hospitalid=${hospital_id}&type=1`)
                                .then(res => res.json())
                                .then(json => json.data)
                                .catch(err => console.log(err))
        let location_hospital = await fetch(`https://rs-bed-covid-api.vercel.app/api/get-hospital-map?hospitalid=${hospital_id}`)
                                    .then(res => res.json())
                                    .then(json => {
                                            return {lat: json.data.lat , long: json.data.long}
                                        })
                                    .catch(err => console.log(err))
        
        // set detail data hospital
        for(let [key , value] of Object.entries(detail_hospital)) {
            // modalDetail.querySelector(`p[data-key="${key}"]`).textContent = value
            let element = modalDetail.querySelector(`p[data-key="${key}"]`)
            element ? element.textContent = value : ""
        }

        // set maps
        let listBed = ``
        detail_hospital.bedDetail.forEach(data => {
            console.log(data.stats)
            listBed += `
                <div class="w-full md:w-1/3 p-2 box-border">
                    <div class="bg-white rounded-md h-full shadow-md p-3">
                        <h5 class="font-semibold">${data.stats.title}</h5>
                        <p class="text-sm">Bed available : ${data.stats.bed_available}</p>
                        <p class="text-sm">Bed empty : ${data.stats.bed_empty}</p>
                    </div>
                </div>
            `
        })
        document.getElementById('listBed').innerHTML = listBed
        
        modalDetail.querySelector('iframe#gmap_canvas').setAttribute('src' , `https://maps.google.com/maps?q=${location_hospital.lat},${location_hospital.long}&t=&z=13&ie=UTF8&iwloc=&output=embed`)

        modalDetail.style.opacity = 1
        modalDetail.style.pointerEvents = "all"

        // https://maps.google.com/maps?q=-8.6493,115.226&t=&z=13&ie=UTF8&iwloc=&output=embed
    }
})