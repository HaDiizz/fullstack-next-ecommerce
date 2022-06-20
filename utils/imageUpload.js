export const imageUpload = async (images) => {

    let imgArr = []

    const formData = new FormData()
        formData.append("file", images)
        formData.append("upload_preset", process.env.CLOUD_UPDATE_PRESET)
        formData.append("cloud_name", process.env.CLOUD_NAME)

        const res = await fetch(process.env.CLOUD_API, {
            method: "POST",
            body: formData
        })

        const data = await res.json()
        // console.log(data)

        imgArr.push({public_id: data.public_id, url: data.secure_url})

    return imgArr;
}

export const imageUploadArr = async (images) => {
    // console.log(images)
    let imgArr = []
    for(const item of images) {
        // console.log(item)
        const formData = new FormData()
        formData.append("file", item)
        formData.append("upload_preset", process.env.CLOUD_UPDATE_PRESET)
        formData.append("cloud_name", process.env.CLOUD_NAME)

        const res = await fetch(process.env.CLOUD_API, {
            method: "POST",
            body: formData
        })

        const data = await res.json()
        // console.log(data)

        imgArr.push({public_id: data.public_id, url: data.secure_url})


    }
    return imgArr;
}