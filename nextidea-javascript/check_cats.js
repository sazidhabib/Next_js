async function checkCategories() {
    try {
        const response = await fetch('https://demo.nextideasolution.com/api/get-categories.php');
        const data = await response.json();
        console.log(JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Error:', error);
    }
}
checkCategories();
