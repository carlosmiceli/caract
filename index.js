// Define a function to create elements in your custom library
function createElement(type, props, ...children) {
    return {
        type,
        props: {
            ...props,
            children: children.map(child =>
                typeof child === "object"
                    ? child
                    : createTextElement(child)
            ),
        },
    }
}

// Define a function to create text elements in your custom library
function createTextElement(text) {
    return {
        type: "TEXT_ELEMENT",
        props: {
            nodeValue: text,
            children: [],
        },
    }
}

// Define a function to render elements in the browser
function render(element, container) {
    // Create a new DOM node based on the type of the element
    const dom =
        element.type == "TEXT_ELEMENT"
            ? document.createTextNode("")
            : document.createElement(element.type)

    // Set any additional properties on the node based on the props of the element
    const isProperty = key => key !== "children"
    Object.keys(element.props)
        .filter(isProperty)
        .forEach(name => {
            dom[name] = element.props[name]
        })

    // Recursively render any child elements of the element
    element.props.children.forEach(child =>
        render(child, dom)
    )

    // Append the new node to the container node
    container.appendChild(dom)
}

// Define a custom library called Caract that includes the createElement and render functions
const Caract = {
    createElement,
    render,
}

// Use the Caract.createElement function to create an element with JSX syntax
/** @jsx Caract.createElement */
const element = (
    <div style="background: salmon">
        <h1>Hello World</h1>
        <h2 style="text-align:right">from Caract</h2>
    </div>
);

// Get the container node and render the element into it using the Caract.render function
const container = document.getElementById("root")
Caract.render(element, container)