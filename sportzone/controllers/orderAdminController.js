const Order = require('../models/order');
const view = require('../views/orderAdmin');
const allowed = ['new','confirmed','shipping','delivered','cancelled'];
exports.list = async (req,res) => {
 const status=String(req.query.status||''); const q=String(req.query.q||'').trim().slice(0,80);
 if(status&&!allowed.includes(status)) return res.status(400).send('Trạng thái không hợp lệ');
 const pg=Math.max(1,Math.min(100000,parseInt(req.query.page,10)||1));
 const result=await Order.list({status,q,offset:(pg-1)*30});
 const stats=await Order.stats();
 res.send(view.list(req,{...result,stats,status,q,pg,pages:Math.max(1,Math.ceil(result.count/30))}));
};
exports.detail=async(req,res)=>{
 const id=Number(req.params.id);if(!Number.isSafeInteger(id)||id<1)return res.status(404).send('Không tìm thấy đơn hàng');
 const order=await Order.adminById(id);if(!order)return res.status(404).send('Không tìm thấy đơn hàng');
 res.send(view.detail(req,order));
};
exports.status=async(req,res)=>{
 const id=Number(req.params.id),status=String(req.body.status||'');
 if(!Number.isSafeInteger(id)||id<1||!allowed.includes(status))return res.status(400).send('Dữ liệu không hợp lệ');
 if(!await Order.setStatus(id,status))return res.status(404).send('Không tìm thấy đơn hàng');
 res.redirect('/admin/orders/'+id+'?saved=1');
};
