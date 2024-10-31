import e from "express";
import "dotenv/config"
import connectToDB from "./config/db.config.js";
import Post from "./models/posts.models.js"
import cors from "cors"
import path from "path";
import upload from "./storage.js"

connectToDB()


const port = process.env.PORT || 3000
const app = e()

app.use(e.json())
app.use(e.urlencoded({ extended: true }))
app.use(cors())
app.use("/uploads", e.static(path.join(process.cwd(), "uploads")))


app.get("/api/posts", async (req, res) => {
    try {
        const posts = await Post.find()
        res.status(200).json({
            statuscode: res.statusCode,
            posts: posts,
            message: "Data Fetched"
        })
    } catch (error) {
        res.status(500).json({
            statuscode: res.statusCode,
            error: 'Internal Server Error',
            message: error
        })
    }
})

app.post("/api/posts", upload.single("file"), async (req, res) => {
    try {

        const { title, content } = req.body
        const file = req.file ? req.file.filename : undefined;

        if (!title || !content) {
            res.status(400).json({
                statuscode: res.statusCode,
                error: 'Title and content are required fields',
                message: "Fill Title and Content"
            })
        }

        const post = await Post.create({ title, content, file })
        res.status(201).json({
            statuscode: res.statusCode,
            post: post,
            message: "Data Recived"
        })


    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({
            statuscode: res.statusCode,
            error: 'Internal Server Error',
            message: error
        })
    }
})

app.post("/api/posts/like/:postId", async (req, res) => {
    try {
        const postId = req.params.postId;
        const post = await Post.findById(postId)

        if (!post) {
            return res.status(404).json({
                statuscode: res.statusCode,
                error: 'Post Not Found',
                message: error
            })
        }

        post.likes += 1
        await post.save()

        res.status(200).json({
            statuscode: res.statusCode,
            post: post,
            message: "Like Updated"
        })

    } catch (error) {
        console.error('Error liking post:', error);
        res.status(500).json({
            statuscode: res.statusCode,
            error: 'Internal Server Error',
            message: `Error liking the post ${error}`
        })
    }
})


app.post("/api/posts/comment/:postId",async (req,res)=>{
    try {
        const postId = req.params.postId;
        const {text} = req.body
        const post = await Post.findById(postId)


        if (!post) {
            return res.status(404).json({
                statuscode: res.statusCode,
                error: 'Post Not Found',
                message: error
            })
        }
        post.comments.push({text})
        await post.save()
        res.status(200).json({
            statuscode: res.statusCode,
            post: post,
            message: "Comment Updated"
        })


    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).json(
            res.status(500).json({
                statuscode: res.statusCode,
                error: 'Internal Server Error',
                message: `Error adding the comment ${error}`
            })
        );
    }
})


app.get("/test", (req, res) => {
    res.status(200).json({
        statuscode: res.statusCode,
        message: "Running"
    })
})

app.listen(port, () => {
    console.log(`running at http://localhost:${port}`)
})