#!/bin/bash

curl https://qudt5o1bui.execute-api.us-east-1.amazonaws.com/dev/users > output.txt
echo -e "" >> output.txt
curl --request POST 'https://qudt5o1bui.execute-api.us-east-1.amazonaws.com/dev/users' --header 'Content-Type: application/json' --data-raw '{"name": "Mike", "userId": "12345"}' >> output.txt
echo -e "" >> output.txt
curl https://qudt5o1bui.execute-api.us-east-1.amazonaws.com/dev/users/12345 >> output.txt
echo -e "" >> output.txt
curl https://qudt5o1bui.execute-api.us-east-1.amazonaws.com/dev/users >> output.txt
echo -e "" >> output.txt
curl -X DELETE https://qudt5o1bui.execute-api.us-east-1.amazonaws.com/dev/users/12345 >> output.txt
echo -e "" >> output.txt
curl https://qudt5o1bui.execute-api.us-east-1.amazonaws.com/dev/users >> output.txt