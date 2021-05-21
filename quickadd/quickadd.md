<%*
const choices = [
        {option: "💭 Add a Thought", startSymbol: "~", path: "bins/templates/Inputs/Thought.md"},
        {option: "✔ Add a Task", startSymbol: "", path: "bins/templates/New Task.md"},
        {option: "📥 Add an Inbox item", startSymbol: `${tp.date.now("gggg-MM-DD - ddd MMM D")} -`, path: "bins/templates/Inbox Template.md"},
]

tp.user.QuickAdd(tp, choices);
%>