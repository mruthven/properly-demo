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
echo -e "" >> output.txt
curl --request POST 'https://qudt5o1bui.execute-api.us-east-1.amazonaws.com/dev/properties' --header 'Content-Type: application/json' --data-raw '{"propertyId": 243567, "location": "Lethbridge", "isActive": "true"}' >> output.txt
echo -e "" >> output.txt
curl --request POST 'https://qudt5o1bui.execute-api.us-east-1.amazonaws.com/dev/properties' --header 'Content-Type: application/json' --data-raw '{"propertyId": 2897169, "location": "Halifax", "isActive": "false"}' >> output.txt
echo -e "" >> output.txt
curl https://qudt5o1bui.execute-api.us-east-1.amazonaws.com/dev/properties/active >> output.txt