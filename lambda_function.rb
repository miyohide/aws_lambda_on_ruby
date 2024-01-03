require 'pg'
require 'aws-sdk-secretsmanager'
require 'json'

module LambdaFunction
  class Handler
    def self.process(event:,context:)
      client = Aws::SecretsManager::Client.new(region: ENV['AWS_REGION'])

      begin
        res = client.get_secret_value(secret_id: ENV['MY_SECRETS_NAME'])
      rescue StandardError => e
        raise e
      end

      secret = JSON.parse(res.secret_string)

      conn = PG.connect(
        host: secret['host'],
        port: 5432,
        user: secret['username'],
        password: secret['password']
      )
      conn.exec("SELECT * FROM pg_stat_activity") do |result|
        puts "     PID | User             | Query"
        result.each do |row|
          puts " %7d | %-16s | %s " % row.values_at('pid', 'username', 'query')
        end
      end
      "Hello from Lambda!"
    end
  end
end
