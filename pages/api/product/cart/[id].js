import connectDB from "../../../../utils/connectDB";
import Product from "../../../../models/productModel";
import auth from "../../../../middleware/auth";

connectDB();

export default async (req, res) => {
  switch (req.method) {
    case 'PUT':
        await putProduct(req, res)
        break;
    case 'GET':
        await getProduct(req, res)
        break;
  }
};

//Update product
const putProduct = async (req, res) => {
    try {
        const result = await auth(req, res)
        if(result.role !== 'seller')
            return res.status(400).json({err: 'Authentication is not valid.'})

        const {id} = req.query
        const {title, price, inStock, content, category, images} = req.body

        if(!title || !price || !content || category === 'all' || images.length === 0)
            return res.status(400).json({err: 'กรุณากรอกข้อมูลให้ครบถ้วน'})

        await Product.findOneAndUpdate({_id: id}, {
            title: title.toLowerCase(), price, inStock, content, category, images
        })

        res.json({msg: 'อัพเดทข้อมูลสำเร็จ'})
        
    } catch (err) {
        return res.status(500).json({err: err.message})
    }
}

const getProduct = async (req, res) => {
    try {
            const {id} = req.query
            const product = await Product.findById(id)  //olds findone
            if(!product) res.status(400).json({err: 'ไม่พบสินค้า'})

            return res.json({product})

    } catch (err) {
        return res.status(500).json({err: err.message});
    }
}
