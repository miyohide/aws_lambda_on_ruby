require 'pg'
#require 'active_support/all'

module LambdaFunction
  class Handler
    def self.process(event:,context:)
      # 1.month.from_now
      "Hello World"
    end
  end
end
