# tsc --build
# Copy-Item .\src\.env .\build\.env
docker image build -t fakeawakepc.local:5000/discord-bot:2.1.0 .
docker image push fakeawakepc.local:5000/discord-bot:2.1.0