let expression = ""

let display = document.getElementById("display")
let buttons = document.querySelectorAll("button")

buttons.forEach(function (button) {
    button.addEventListener("click", function (e) {
        let value = button.textContent
        if (value === "=") {
            try {
                expression = eval(expression)
            } catch {
                expression = "Error"
            }
        }
        else if (value === "C") {
            expression = ""
        }
        else {
            expression += value;
        }

        display.value = expression
    })
})