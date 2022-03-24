var booksOrdered = []

document.getElementById("submit-button").onclick = () => {
    let checkedBoxes = document.getElementsByClassName("checking")
    let vals = [];
    for (let box of checkedBoxes) {
        if(box.checked) {
            vals.push(box.value)
        }
    }

    axios.post('http://localhost:3000/books', {
        books_ordered: vals
    })
    .then( (response) => {
        console.log('Sent!')
    })
}

