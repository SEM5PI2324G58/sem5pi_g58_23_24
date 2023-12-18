

using MDTarefas.Models;
using MDTarefas.Models.tarefa;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace MDTarefas.repo;

public class TarefaRepo
{
    private readonly IMongoCollection<Tarefa> _tarefaCollection;

    public TarefaRepo(
        IOptions<TarefaDatabaseSettings> tarefaDatabaseSettings)
    {
        var mongoClient = new MongoClient(
            tarefaDatabaseSettings.Value.ConnectionString);

        var mongoDatabase = mongoClient.GetDatabase(
            tarefaDatabaseSettings.Value.DatabaseName);

        _tarefaCollection = mongoDatabase.GetCollection<Tarefa>(
            tarefaDatabaseSettings.Value.TarefaCollectionName);
    }

    public async Task<List<Tarefa>> GetAsync() =>
        await _tarefaCollection.Find(_ => true).ToListAsync();

    public async Task<Tarefa?> GetAsync(string id) =>
        await _tarefaCollection.Find(x => x.Id == id).FirstOrDefaultAsync();

    public async Task CreateAsync(Tarefa newTarefa) =>
        await _tarefaCollection.InsertOneAsync(newTarefa);

    public async Task UpdateAsync(string id, Tarefa updatedTarefa) =>
        await _tarefaCollection.ReplaceOneAsync(x => x.Id == id, updatedTarefa);

    public async Task RemoveAsync(string id) =>
        await _tarefaCollection.DeleteOneAsync(x => x.Id == id);
}