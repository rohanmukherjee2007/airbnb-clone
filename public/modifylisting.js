document.querySelector('#delete').addEventListener("click", (event) => {
    const path = window.location.pathname;
    const id = path.replace("/listings/", "");
    axios.delete(`/listings/${id}`)
        .then((resolve) => {
            console.log("path:", path);
            console.log("id:", id);
            console.log("Deleted Successfully");
            window.location.href = "/listings";
        })
        .catch((reject) => {
            console.log(reject);
        });
});