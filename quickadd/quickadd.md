<%*
const choices = [
        {option: "💭 Add a Thought", startSymbol: "~", path: "bins/templates/Inputs/Thought.md"},
        {option: "✔ Add a Task", startSymbol: "", path: "bins/templates/New Task.md", folder: "tasks"},
        {option: "📥 Add an Inbox item", format: `{{DATE:ggD hh-ss}}`, folder: "inbox", path: "bins/templates/Inbox Template.md"},
        {option: "✍ Quick Capture", captureTo: "inbox/appendToInbox.md", format: "# [[{{DATE:gggg-MM-DD - ddd MMM D}}]] {{DATE:hh:mm}}\n{{LINKCURRENT}}: {{VALUE}}\n\n"},
        {option: "✔ Quick Capture Task", captureTo: "inbox/tasks.md", task: true, format: "{{VALUE}} 📆 {{DATE}}", appendLink: true}
]

tR += await tp.user.QuickAdd(tp, choices);
%>