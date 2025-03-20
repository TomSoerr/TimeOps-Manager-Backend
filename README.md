# API Docs


| HTTP Method            | Endpoint                      | Description                                                   |
| ---------------------- | ----------------------------- | ------------------------------------------------------------- |
| **Entries Management** |                               |                                                               |
| GET                    | `/api/v1/entries`             | Get entries for last 3 months                                 |
| POST                   | `/api/v1/entries`             | Create a new entry                                            |
| PUT                    | `/api/v1/entries/:id`         | Update an entry                                               |
| **Running Entry**      |                               |                                                               |
| GET                    | `/api/v1/entries/running`     | Get running entry if available                   |
| POST                   | `/api/v1/entries/running`     | Start running entry                                           |
| PUT                    | `/api/v1/entries/running`   | End running entry                                             |
| GET                    | `/api/v1/entries/running/nfc` | Simple webpage for NFC start/stop with token storage          |
| **Tags Management**    |                               |                                                               |
| GET                    | `/api/v1/tags`                | Get list with all tags                                        |
| POST                   | `/api/v1/tags`                | Create a new tag                                              |
| PUT                    | `/api/v1/tags/:id`            | Update a tag                                                  |
| **Analytics**          |                               |                                                               |
| GET                    | `/api/v1/analytics`           | Get analytics data for last two years in JSON                 |
| GET                    | `/api/v1/analytics/pdf`       | Generate PDF file with LaTeX                                  |
| **Database**           |                               |                                                               |
| POST                   | `/api/v1/db`                  | Import CSV file from Toggl or JSON file from Time Ops Manager |
| GET                    | `/api/v1/db`                  | Export database to JSON                                       |
| GET                    | `/api/v1/db/seed`             | Seed database                                                 |

# Help

docker ps

list all active docker containers


# TODO

use TRIM for SSD