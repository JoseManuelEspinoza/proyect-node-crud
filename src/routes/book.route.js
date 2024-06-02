const express=require("express");
const router=express.Router();
const Book=require('../models/book.model');

//MIDDLEWARE
const getBook=async(req,res,next)=>{
    let book;
    const {id}=req.params;
    if(!id.match(/^[0-9a-fA-F]{24}$/)){
        return res.status(400).json({message:'Invalid ID'})
    }
    try{
        book=await Book.findById(id);
        if(!book){
            return res.status(404).json({message:'Book not found'})
        }

    }catch(error){
        return res.status(500).json({message:error.message})
    
    }
    res.book=book;
    next();
}

//Obtener todos los libros
router.get('/',async(req,res)=>{
    try{
        const books=await Book.find();
        console.log('GET ALL',books);
        if(books.length===0){
            return res.status(204).json([])
        }
        res.json(books);
    }catch(error){
        res.status(500).json({
            message:error.message
        })

    }
});
//Crear un nuevo libro
router.post('/',async(req,res)=>{
    const {title,author,genre,publication_data}=req.body
    if(!title || !author || !genre || !publication_data){
        return res.status(400).json({message:'Todos los campos son obligatorios'})
    }
    const book=new Book({
        title,
        author,
        genre,
        publication_data
})
    try{
        const newBook=await book.save();
        res.status(201).json(newBook);
    }catch(err){
        res.status(500).json({message:err.message});
    }
});
//Get individiual
router.get('/:id',getBook,async(req,res)=>{
    res.json(res.book);
});
//Actualizar un libro
router.put('/:id',getBook,async(req,res)=>{
    try{
        const book=res.book;
        book.title=req.body.title||book.title;
        book.author=req.body.author||book.author;
        book.genre=req.body.genre||book.genre;
        book.publication_data=req.body.publication_data||book.publication_data;
        const updatedBook=await book.save();
        res.json(updatedBook);

    }catch(error){
        res.status(400).json({message:error.message})
    }
})
router.patch('/:id',getBook,async(req,res)=>{
    if(!req.body.title && !req.body.author&& !req.body.genre&& !req.body.publication_data ){
        return res.status(400).json({message:'Al meno se debe de enviar alguno de los parametros'})
    }
    try{
        const book=res.book;
        book.title=req.body.title||book.title;
        book.author=req.body.author||book.author;
        book.genre=req.body.genre||book.genre;
        book.publication_data=req.body.publication_data||book.publication_data;
        const updatedBook=await book.save();
        res.json(updatedBook);

    }catch(error){
        res.status(400).json({message:error.message})
    }
})
//Eliminar un libro
router.delete('/:id',getBook,async(req,res)=>{
    try{
        const book=res.book
        await book.deleteOne({
            _id:book._id
        });
        res.json({message:'Book deleted'});
        }catch(error){
            res.status(500).json({message:error.message});
        }
})
module.exports=router