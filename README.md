# Strapi plugin github-actions

A plugin which adds a mechanism to trigger specific github actions (using the `repository_dispatch` event, an `event_type`, and optionally a `client_payload`).
The use case for this plugin is building a static site in GitHub without using webhooks which may be triggered too often.

## Installation

```
npm install -S strapi-plugin-github-actions
npm run build
npm run develop
```

## Configuration

First, you need to add one or multiple `workflows` in your content.

- Go to the administration panel, and you'll see a new collection type called `Workflows`.
- Add a new workflow by filling all its details
- Once saved, you can trigger the workflow by going to Plugins > GitHub Actions Plugin and clicking on the 'start' button.

### Optional: configure the view for the workflow model

Strapi does not yet offer a way for plugins to configure their models' views, nor to hide themselves from the collection types. Initially, this plugin should have been configurable only through the settings but unfortunately this is not yet possible.

To have an opinionated view of the workflow model, you can update the `core_store` table of the database (`.tmp/data.db` by default):

```sql
UPDATE `core_store`
SET `value` = '{"uid":"plugins::github-actions.workflow","settings":{"bulkable":true,"filterable":true,"searchable":true,"pageSize":10,"mainField":"name","defaultSortBy":"name","defaultSortOrder":"ASC"},"metadatas":{"pat":{"edit":{"label":"Personal Access Token","description":"GitHub PAT with repo scope","placeholder":"","visible":true,"editable":true},"list":{"label":"Pat","searchable":true,"sortable":true}},"github_host":{"edit":{"label":"GitHub Host","description":"GitHub host (not URL)","placeholder":"github.com","visible":true,"editable":true},"list":{"label":"Github_host","searchable":true,"sortable":true}},"repo_owner":{"edit":{"label":"Repository owner","description":"","placeholder":"","visible":true,"editable":true},"list":{"label":"Repo_owner","searchable":true,"sortable":true}},"created_at":{"edit":{"label":"Created_at","description":"","placeholder":"","visible":false,"editable":true},"list":{"label":"Created_at","searchable":true,"sortable":true}},"name":{"edit":{"label":"Name","description":"Workflow name (will be shown in the buttons)","placeholder":"","visible":true,"editable":true},"list":{"label":"Name","searchable":true,"sortable":true}},"started_at":{"edit":{"label":"Started At","description":"Last start date of the trigger","placeholder":"","visible":true,"editable":false},"list":{"label":"Started_at","searchable":true,"sortable":true}},"updated_at":{"edit":{"label":"Updated_at","description":"","placeholder":"","visible":false,"editable":true},"list":{"label":"Updated_at","searchable":true,"sortable":true}},"repo_name":{"edit":{"label":"Repository name","description":"","placeholder":"","visible":true,"editable":true},"list":{"label":"Repo_name","searchable":true,"sortable":true}},"client_payload":{"edit":{"label":"client_payload","description":"Payload that will be passed to the repository_dispatch. Can be accessed with github.event.client_payload.XXX.","placeholder":"","visible":true,"editable":true},"list":{"label":"Client_payload","searchable":false,"sortable":false}},"id":{"edit":{},"list":{"label":"Id","searchable":true,"sortable":true}},"description":{"edit":{"label":"Description","description":"Workflows description (will be shown in the button)","placeholder":"","visible":true,"editable":true},"list":{"label":"Description","searchable":true,"sortable":true}},"event_type":{"edit":{"label":"event_type","description":"The event_type your repository_dispatch acts on","placeholder":"","visible":true,"editable":true},"list":{"label":"Event_type","searchable":true,"sortable":true}}},"layouts":{"list":["name","repo_owner","repo_name","event_type"],"edit":[[{"name":"name","size":6},{"name":"description","size":6}],[{"name":"github_host","size":6},{"name":"pat","size":6}],[{"name":"repo_owner","size":6},{"name":"repo_name","size":6}],[{"name":"event_type","size":6}],[{"name":"client_payload","size":12}]],"editRelations":[]}}'
WHERE `key` = 'plugin_content_manager_configuration_content_types::plugins::github-actions.workflow'
```

## Example GitHub action file:

```yml
name: Do something

on:
  repository_dispatch:
    types: do_something

jobs:
  build:
    name: Do the thing
    runs-on: ubuntu-latest
    steps:
      - name: First step
        run: echo Starting
      - name: Second step
        run: echo ${{ github.event.client_payload.text }}
```

To trigger the CI of a repository with this file, you must add a new workflow with the `event_type` as `do_something` and `client_payload` as `{"text":"Hello world"}`.

## Todo

- Implement some kind of permissions settings
- i18n
