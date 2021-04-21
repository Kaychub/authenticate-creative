<template>
    <div id='container'>
        <div id='spacer'></div>
        <footer>
            <p>Made by Caleb Hunt</p>
            <a href="https://github.com/Kaychub/mongo-express-creative"><img src="/images/GitHub-Mark-32px.png" title="Github Repo for this project" ></a>
        </footer>
    </div>
</template>

<script>
export default {
    name: 'Footer',
}
</script>

<style scoped>
#spacer {
    height: 50px;
}

footer {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    background-color: #ddd;
    color: #000;

    max-height: 40px;
    
    padding-top: 10px;
    
    position: fixed;
    bottom: 0;
    left: 0;
    right: 100%;
    width: 100%;
}
</style>