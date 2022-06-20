const valid = (name, email, password, cf_password, telephone) => {
    if(!name || !email || !password || !telephone) {
        return 'กรุณากรอกข้อมูลให้ครบถ้วน'
    }

    if(!validateEmail(email)) {
        return 'อีเมลนี้ถูกใช้งานแล้ว/อีเมลไม่ถูกต้อง'
    }
    if(password.length < 6) {
        return 'รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร'
    }

    if(password !== cf_password) {
        return 'รหัสผ่านไม่ตรงกัน'
    }
}

function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

export default valid