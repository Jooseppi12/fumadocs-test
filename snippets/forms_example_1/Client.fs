namespace forms_example_1

open WebSharper
open WebSharper.JavaScript
open WebSharper.UI
open WebSharper.UI.Client
open WebSharper.UI.Templating

// <FUMADOCS BEGIN>
[<JavaScript>]
module Client =
    // The templates are loaded from the DOM, so you just can edit index.html
    // and refresh your browser, no need to recompile unless you add or remove holes.
    type IndexTemplate = Template<"wwwroot/index.html", ClientLoad.FromDocument>

    let People = ListModel.FromSeq [ "John"; "Paul" ]


    [<SPAEntryPoint>]
    let Main () =
        let newName = Var.Create ""

        IndexTemplate
            .Main()
            .ListContainer(People.View.DocSeqCached(fun (name: string) -> IndexTemplate.ListItem().Name(name).Doc()))
            .Name(newName)
            .Add(fun _ ->
                People.Add(newName.Value)
                newName.Value <- "")
            .Doc()
        |> Doc.RunById "main"
// <FUMADOCS END>
