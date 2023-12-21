require 'pg'

module LambdaFunction
  class Handler
    def self.process(event:,context:)
      conn = PG.connect(
        host: ENV['PG_HOSTNAME'],
        port: 5432,
        user: ENV['PG_USERNAME'],
        password: ENV['PG_PASSWORD']
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
